"""
Python script to collect all the fetch handlers
"""

import os
import json

if __name__ == "__main__":
    traec_path = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    fetch_handler_path = os.path.join(traec_path, 'src', 'fetchHandlers')
    fetch_handlers = []

    for (root, dirs, files) in os.walk(fetch_handler_path):
        for file in files:
            if file.endswith('.js') and not file == 'index.js':
                js_file = os.path.join(root, file)

                with open(js_file) as file_obj:
                    lines = file_obj.readlines()

                    for line in lines:
                        if line.startswith('export const'):
                            fetch_handlers.append(line.split(' ')[2])

    output_file = os.path.join(os.path.dirname(__file__), 'actualFetchHandlers.js')

    with open(output_file, 'w') as out:
        out.write('export const handlers =')
        json.dump(fetch_handlers, out)