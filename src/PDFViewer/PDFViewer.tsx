import {Document, Page, pdfjs} from "react-pdf";
import React, {useEffect, useRef, useState} from "react";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import "./PDFViewer.scss";
import {Spin} from "antd";
import {DocumentCallback} from "react-pdf/src/shared/types";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    //'//unpkg.com/pdfjs-dist@4.3.136/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();


type TPDFViewerProps = {
    fileUrl?: string,
    pageLoading: "all" | "scroll-load",
    height?: number,
}

const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
};

type TPagesProps = {
    height: number,
    widht: number
}

const PDFViewer = (props: TPDFViewerProps) => {
    const contRef = useRef<HTMLDivElement>(null)
    const [pagesTotal, setPagesTotal] = useState(0)
    const [pagesCompleted, setPagesCompleted] = useState(0)
    const pdfRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [pagesProps, setPagesProps] = useState<TPagesProps[]>([])


    const onDocumentLoadSuccess = async (pdf: DocumentCallback) => {
        setPagesTotal(pdf.numPages)

        for (let i = 0; i < pdf.numPages; i++) {
            const page = await pdf.getPage(i + 1)
            setPagesProps(current => [...current, {height: page.view[3], widht: page.view[2]}])
        }
    };


    return (
        <Spin size={"large"}
              className={"pdf-viewer-spin-cont"}
              tip={"Dokument wird geladen, bitte warten"}
              spinning={pagesCompleted < pagesTotal}
        >
            <div className={"pdf-viewer-cont"}
                 ref={contRef}
                 style={{height: window.innerHeight - 70}}
            >
                <Document file={props.fileUrl}
                          onLoadSuccess={onDocumentLoadSuccess}
                          loading={"Dokument wird geladen"}
                          noData={"Datei nicht gefunden"}
                          error={"Das Dokument konnte nicht geladen werden"}
                          options={options}
                          inputRef={pdfRef}
                >

                    {pagesProps.map((page, i) => (
                        <div key={i}>
                            <Page pageNumber={i + 1}
                                  onLoadSuccess={() => setPagesCompleted(current => current + 1)}
                                  loading={"Seite wird geladen"}
                                  error={"Die Seite konnte nicht geladen werden"}
                                  scale={1}
                                  canvasRef={canvasRef}
                                  width={page.widht > page.height ? undefined : window.innerWidth - 20}
                                  height={page.widht > page.height ? window.innerHeight : undefined}
                            />
                        </div>))
                    }
                </Document>
            </div>
        </Spin>
    )
}

export default PDFViewer
