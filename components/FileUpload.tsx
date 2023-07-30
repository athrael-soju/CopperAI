// FileUpload.js
import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import '@fortawesome/fontawesome-free/css/all.min.css';

//import 'filepond/dist/filepond.min.css'; // Imported in globals.css

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

interface FileUploaderProps {
  username: string;
}

const FileUpload: React.FC<FileUploaderProps> = ({ username }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [ingesting, setIngesting] = useState(false);

  return (
    <div>
      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={true}
        maxFiles={3}
        server={{
          process: (
            fieldName,
            file,
            metadata,
            load,
            error,
            progress,
            abort
          ) => {
            let formData = new FormData();
            formData.append(fieldName, file, file.name);
            //formData.append('userName', username);

            const request = new XMLHttpRequest();
            request.open('POST', '/api/processUpload');

            // Use `request.upload.onprogress` to handle progress updates
            request.upload.onprogress = (e) => {
              progress(e.lengthComputable, e.loaded, e.total);
            };

            // Use `request.onload` to handle the response from the server
            request.onload = function () {
              if (request.status >= 200 && request.status < 300) {
                load(request.responseText);
                // After successful upload, call another API.
                formData = new FormData();
                formData.append('username', username);
                const anotherRequest = new XMLHttpRequest();
                anotherRequest.open('POST', '/api/processIngest', true);
                setIngesting(true); // Start the Ingesting state
                // Add any necessary headers and/or data.
                // anotherRequest.setRequestHeader(
                //   'Content-Type',
                //   'application/json'
                // );

                anotherRequest.send(formData);

                anotherRequest.onload = function () {
                  if (
                    anotherRequest.status >= 200 &&
                    anotherRequest.status < 300
                  ) {
                    setIngesting(false); // End the Ingesting state
                    console.log('Data Ingest API Call Successful');
                  } else {
                    console.log('Data Ingest API Call Failed');
                  }
                };
              } else {
                error('Failed to Upload File');
              }
            };
            request.send(formData);
            // Return an abort method to stop the request
            return {
              abort: () => {
                request.abort();
                abort();
              },
            };
          },
        }}
        name="files"
        labelIdle={`<div class="filepond--label-idle"><i class="fas fa-cloud-upload-alt" style="font-size: 60px; color: white; margin-right: 20px;"></i><div >${
          ingesting
            ? '<span>Ingesting<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span></span>'
            : 'Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        }</div></div>`}
      />
    </div>
  );
};

export default FileUpload;
