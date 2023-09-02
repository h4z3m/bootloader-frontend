import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { StatusContext } from "../StatusContext/StatusContext";
import "./Homepage.scss";

const Homepage = () => {
  const [flashAddress, setFlashAddress] = useState("0x00000000");
  const [eraseAddress, setEraseAddress] = useState("0x00000000");
  const { listening, isBootloaderConnected } = useContext(StatusContext);
  const [pageCount, setPageCount] = useState(0);
  const [response, setResponse] = useState("");
  const [binaryFile, setBinaryFile] = useState();
  const [version, setVersion] = useState("");
  const server_url = import.meta.env.VITE_APP_API;
  const fromHex = (hex) => {
    return parseInt(hex, 16);
  };

  const readVersion = () => {
    axios
      .get(`${server_url}/bl/version`)
      .then((response) => {
        console.log(response);
        setVersion(response.data.version);
        setResponse(JSON.stringify(response.data));
      })
      .catch((error) => {
        setResponse(error);
      });
  };

  const flashUpload = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", binaryFile);
    data.append("address", fromHex(flashAddress));
    axios
      .post(`${server_url}/bl/flash`, data)
      .then((response) => {
        console.log(response);
        setResponse(JSON.stringify(response.data));
      })
      .catch((error) => {
        setResponse(error);
      });
  };

  const flashErase = (e) => {
    e.preventDefault();
    console.log(eraseAddress);
    const data = {
      address: fromHex(eraseAddress),
      count: pageCount,
    };
    axios
      .post(`${server_url}/bl/erase`, data)
      .then((response) => {
        console.log(response);
        setResponse(response.data);
      })
      .catch((error) => {
        setResponse(error);
      });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeInBytes = file.size;
      const fileSizeInKb = fileSizeInBytes / 1024;
      const fileSizeInMb = fileSizeInKb / 1024;
      console.log(
        `File size: ${fileSizeInBytes} bytes (${fileSizeInKb} KB or ${fileSizeInMb} MB)`
      );
      setBinaryFile(file);
    }
  };

  return (
    <>
      {isBootloaderConnected && listening ? (
        <>
          <section className="commands-section">
            <div className="version-section card2">
              <h3>Version</h3>
              <div className="version">
                {version ? <p>v.{version}</p> : <p>?</p>}
              </div>
              <button onClick={readVersion}>Read version</button>
            </div>

            <form
              className="flash-section"
              onSubmit={flashUpload}
              encType="multipart/form-data"
            >
              <h3>Flash section</h3>
              <div className="flash">
                <label htmlFor="flash-address">Flash Address</label>
                <input
                  required
                  className="flash-address"
                  maxLength={10}
                  ref={(target) => {
                    if (target) {
                      target.value = flashAddress;
                    }
                  }}
                  pattern="^0x[0-9a-fA-F]*$"
                  onChange={(e) => {
                    const hexRegex = /0x[0-9A-Fa-f]+/;
                    const input = e.target.value;
                    if (hexRegex.test(input)) {
                      const input = e.target.value;
                      let modifiedInput = input.startsWith("0x")
                        ? input
                        : "0x" + input;

                      e.target.value = modifiedInput;
                      setFlashAddress(modifiedInput);
                    }
                  }}
                ></input>
              </div>

              <div className="file-upload">
                <label htmlFor="file-upload">Binary file</label>
                <input required type="file" onChange={handleFileUpload} />
                {binaryFile ? (
                  <label>Size: {binaryFile?.size} bytes</label>
                ) : null}
              </div>
              <button type="submit">Upload</button>
            </form>
            <form className="erase-section card2" onSubmit={flashErase}>
              <h3>Erase section</h3>
              <div className="erase">
                <label htmlFor="erase-address">Erase Address</label>
                <input
                  required
                  className="erase-address"
                  maxLength={10}
                  ref={(target) => {
                    if (target) {
                      target.value = eraseAddress;
                    }
                  }}
                  value={eraseAddress}
                  pattern="^0x[0-9a-fA-F]*$"
                  onChange={(e) => {
                    const hexRegex = /0x[0-9A-Fa-f]+/;
                    const input = e.target.value;
                    if (hexRegex.test(input)) {
                      const input = e.target.value;
                      let modifiedInput = input.startsWith("0x")
                        ? input
                        : "0x" + input;

                      // e.target.value = modifiedInput;
                      setEraseAddress(modifiedInput);
                    }
                  }}
                ></input>
              </div>
              <div className="erase-page-count">
                <label htmlFor="page-count">Page count</label>
                <input
                  required
                  className="page-count"
                  max={31}
                  min={0}
                  type="number"
                  onChange={(event) => {
                    let { value, min, max } = event.target;
                    value = Math.max(
                      Number(min),
                      Math.min(Number(max), Number(value))
                    );
                    event.target.value = value;
                    setPageCount(value);
                  }}
                ></input>
              </div>
              <button type="submit">Erase</button>
            </form>
            <form className="jump-app">
              <h3>Jump to App section</h3>
              <button>Jump to application</button>
            </form>
          </section>
          <section className="response-section">
            <label>Raw response</label>
            <input
              className="response"
              type="text"
              onChange={(e) => setResponse(e.target.value)}
              disabled
              value={response}
            ></input>
          </section>
        </>
      ) : null}
    </>
  );
};

export default Homepage;
