# Stage 1: Build the React app
# Use the official Node.js image from the Docker Hub
FROM node:18 AS build-frontend

# Set the working directory
WORKDIR /app/frontend

# Copy the package.json and package-lock.json files
COPY frontend/package.json frontend/package-lock.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY frontend/ ./

# Build the React app
RUN npm run build

# Stage 2: Build the Python app
# Use official Python image from the Docker Hub
FROM python:3.12-slim AS build-backend

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install the dependancies
RUN pip install -r requirements.txt

# Copy the rest of the application code
COPY . .

# Copy the React build files
COPY --from=build-frontend /app/frontend/build /app/frontend/build

# Expose the port the app runs on
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]