from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder, PromptTemplate

class MCQ(BaseModel):
    emoji: str = Field(description="Emoji to represent the question")
    question: str = Field(description="Question to ask the user")
    options: list[str] = Field(description="Options for the question")

class MCQList(BaseModel):
    questions: list[MCQ] = Field(description="List of MCQs")

fragments_template = '''
The dream fragments describe a {mood} dream where {protagonist} is in a {location} location.
The dream involves {interaction} with {relation} and {entity}.
Try to think of some dream fragments:
'''

# Second chain - MCQ generation
mcq_template = '''
You need to generate 4 multiple choice questions based on the dream fragments.

IMPORTANT: You must respond with a JSON object that follows this exact format, each question's emoji must be unique and related to the question:
{{"questions":[{{"emoji":"🤔","question":"Your question here","options":["Option A","Option B","Option C","Option D"]}},{{"emoji":"🥳","question":"Your question here","options":["Option A","Option B","Option C","Option D"]}},{{"emoji":"😶‍🌫️","question":"Your question here","options":["Option A","Option B","Option C","Option D"]}},{{"emoji":"👻","question":"Your question here","options":["Option A","Option B","Option C","Option D"]}}]}}

Remember:
1. Generate exactly 4 questions
2. Each question must have exactly 4 options
3. Response must be valid JSON
4. Do not include any additional text, explanations, or markdown

{format_instructions}
'''

mcq_answers_template = '''
The dream fragments describe a {mood} dream where {protagonist} is in a {location} location.
The dream involves {interaction} with {relation} and {entity}.

The user try to recall the dream fragments and generated the following multiple choice questions and answers:
1. {question1}: {answer1}
2. {question2}: {answer2}
3. {question3}: {answer3}
4. {question4}: {answer4}

Format queries for text-to-image and text-to-video generation. 
Only output the query in response. Don't include any additional text, explanations, or markdown.
'''

fragments_prompt_template = ChatPromptTemplate.from_messages([
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", fragments_template)
])

mcq_prompt_template = ChatPromptTemplate.from_messages([
    MessagesPlaceholder(variable_name="chat_history"),
    ("ai", mcq_template)
])

mcq_answers_prompt_template = ChatPromptTemplate.from_messages([
    ("human", mcq_answers_template)
])


def generate_mcq(model, data):
    MCQ_json_parser = JsonOutputParser(pydantic_object=MCQList)

    fragments_chain = fragments_prompt_template | model | StrOutputParser()

    mcq_chain = mcq_prompt_template | model | MCQ_json_parser
    dream_catcher_sys_prompt = "You now serve as dream catcher whose job is to help me rebuild my dreams. I will give you the feeling I felt when I woke up and give you several fragments of dreams that I could recall."
    chat_history = [("system", dream_catcher_sys_prompt)]
    data = data["dreamData"]
    result = fragments_chain.invoke({"chat_history": chat_history,
                                     "mood": data["mood"],
                                     "protagonist": data["protagonist"],
                                     "location": data["fragments"]["location"],
                                     "interaction": data["fragments"]["interaction"],
                                     "relation": data["fragments"]["relation"],
                                     "entity": data["fragments"]["entity"],
                                     })
    chat_history.append(HumanMessage(content=fragments_template.format(mood=data["mood"],
                                                                       protagonist=data["protagonist"],
                                                                       location=data["fragments"]["location"],
                                                                       interaction=data["fragments"]["interaction"],
                                                                       relation=data["fragments"]["relation"],
                                                                       entity=data["fragments"]["entity"]
                                                                       )))
    chat_history.append(AIMessage(content=result))
    result = mcq_chain.invoke({
        "chat_history": chat_history,
        "format_instructions": MCQ_json_parser.get_format_instructions()
    })
    return result

def generate_query(model, data):
    mcq_answers = data['mcqs']
    mcq_answers_chain = mcq_answers_prompt_template | model | StrOutputParser()
    dream_data = data["dreamData"]
    result = mcq_answers_chain.invoke({
        "question1": mcq_answers[0]["question"],
        "answer1": mcq_answers[0]["answer"],
        "question2": mcq_answers[1]["question"],
        "answer2": mcq_answers[1]["answer"],
        "question3": mcq_answers[2]["question"],
        "answer3": mcq_answers[2]["answer"],
        "question4": mcq_answers[3]["question"],
        "answer4": mcq_answers[3]["answer"],
        "mood": dream_data["mood"],
        "protagonist": dream_data["protagonist"],
        "location": dream_data["fragments"]["location"],
        "interaction": dream_data["fragments"]["interaction"],
        "relation": dream_data["fragments"]["relation"],
        "entity": dream_data["fragments"]["entity"],
    })
    return result