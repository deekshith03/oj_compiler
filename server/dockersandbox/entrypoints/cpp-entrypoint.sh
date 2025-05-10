#!/bin/sh

if [ -z "$SUBMISSION_FILE" ]; then
  echo "Error: SUBMISSION_FILE not specified"
  exit 1
fi

echo "Waiting for $SUBMISSION_FILE to be injected..."
timeout=10

# Wait until the file exists, checking every second.
while [ $timeout -gt 0 ]; do
  if [ -f "$SUBMISSION_FILE" ]; then
    break
  fi
  sleep 1
  timeout=$((timeout - 1))
done

if [ ! -f "$SUBMISSION_FILE" ]; then
  echo "Error: Submission file not found after waiting 10 seconds."
  exit 1
fi

echo "Compiling $SUBMISSION_FILE..."
g++ -O2 -o main "$SUBMISSION_FILE"
if [ $? -ne 0 ]; then
  echo "Compilation failed."
  exit 1
fi

echo "Running executable..."
# Check if input.txt exists and run with input redirection
if [ -f "input.txt" ]; then
  ./main < input.txt
else
  ./main
fi
