from pydantic import BaseModel


class SigninSchema(BaseModel):
    username: str
    password: str


class SignupSchema(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str
