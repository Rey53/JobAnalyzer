FROM nginx:alpine

# Copy everything in the current folder to the NGINX web root
COPY . /usr/share/nginx/html

# Point the default root URL straight to the timesheet file so you don't have to type it!
RUN cp /usr/share/nginx/html/timesheet.html /usr/share/nginx/html/index.html

EXPOSE 80
