export interface Fragment {
  location: string;
  interaction: string;
  entity: string;
  relation: string;
}

export interface DreamFormData {
  mood: string;
  protagonist: string;
  fragments: Fragment;
}

export interface CreateMemoryResponse {
  success: boolean;
  data: {
    dreamId: string;
  } | null;
  errorMessage: string | null;
}

export interface Question {
  question: string;
  emoji: string;
  options: string[];
}

interface MCQ {
  question: string;
  emoji: string;
  options: string[];
}

export interface GetMCQsResponse {
  success: boolean;
  errorMessage: string;
  data: {
    dreamId: string;
    mcqs: MCQ[];
  };
}

export interface SubmitMCQAnswersResponse {
  success: boolean;
  errorMessage: string | null;
  prompt: string | null;
}

export interface MCQAnswer {
  question: string;
  answer: string;
}

export interface SubmitMCQsRequest {
  dreamId: string;
  mcqs: MCQAnswer[];
}

export interface GetDreamImageResponse {
  success: boolean;
  errorMessage: string | null;
  data: {
    prompt: string;
    s3: string;
  } | null;
}

export interface Dream {
  dreamId: string;
  prompt: string;
  url: string;
}

export interface GetUserDreamsResponse {
  success: boolean;
  errorMessage: string;
  dreams: Dream[];
}
