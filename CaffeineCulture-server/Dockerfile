# Pull base image
FROM python:3.10.2-slim-bullseye

# Set environment variables
ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /CaffeineCulture-server

# Install dependencies
COPY ./requirements.txt .
RUN pip install -r requirements.txt

EXPOSE 8000

# Copy project
COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
