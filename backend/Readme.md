### Readme

#### **Deploy All Lambda function into **

#### 1. **Set Up a Local Environment**

- Create a directory for your Lambda function code and dependencies.

```sh
cd ${separete_lambda_folder}
```

#### 2. **Install Dependencies Locally**

- Use the `pip` command to install dependencies in the current directory (using the `-t` flag):

```shell
pip install -r requirements.txt -t .
```

This installs the `requests` library (and its dependencies) into the `lambda_function` directory.

#### 3. **Zip the Deployment Package**

- Package all the files, including the dependencies, into a `.zip` file.

```shell
zip -r lambda_function.zip .
```

#### 4. **Upload the Deployment Package to AWS Lambda**

- Go to the [AWS Management Console](https://aws.amazon.com/console/).
- Navigate to the Lambda service.
- Create new lambda function based on the folder name.
- Under the **Code** section, choose **Upload from > .zip file** and upload the `lambda_function.zip`.

#### 5. Configure API Gateway