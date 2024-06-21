import React from 'react';
import './App.css';
import PDFViewer from "./PDFViewer/PDFViewer";

function App() {
  return (
    <div className="App">
        <PDFViewer fileUrl={"https://pdfobject.com/pdf/sample.pdf"} pageLoading={"all"} />
    </div>
  );
}

export default App;
