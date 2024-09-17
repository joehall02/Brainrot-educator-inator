# Use official Python image from the Docker Hub
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install the dependancies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Copy the React build files
COPY frontend/build ./frontend/build

# Expose the port the app runs on
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]