"""
Python script to collect all the handler map properties
"""

import os
import json

if __name__ == "__main__":
    traec_path = os.path.dirname(os.path.dirname(__file__))
    fetch_handler_path = os.path.join(traec_path, 'src', 'fetchHandlers')
    handler_props = {}

    for (root, dirs, files) in os.walk(fetch_handler_path):
        for file in files:
            if file.endswith('.js') and not file == 'index.js':
                js_file = os.path.join(root, file)

                with open(js_file) as file_obj:
                    lines = file_obj.readlines()

                    for line in lines:
                        if 'apiId:' in line:
                            api_call = line.split('api_')[1].strip('\n,"}); ').split("_")

                            key = "_".join(api_call[:-1])
                            call = api_call[-1]
                            if call == 'create':
                                call = 'post'
                            elif call == 'update':
                                call = 'put'

                            if api_call[-2] == 'partial':
                                key = "_".join(api_call[:-2])
                                call = 'patch'

                            handler_props.setdefault(key, []).append(call)

    output_file = os.path.join(os.path.dirname(__file__), 'handlerMapProperties.js')

    with open(output_file, 'w') as out:
        out.write('export const handlerProperties =')
        json.dump(handler_props, out)
