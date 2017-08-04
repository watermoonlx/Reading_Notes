import os
from http.server import HTTPServer, CGIHTTPRequestHandler

os.chdir('./07/webapp')

port = 8080

httpd = HTTPServer(('', port), CGIHTTPRequestHandler)
print("Starting simple_httpd on port: " + str(httpd.server_port))
httpd.serve_forever()

