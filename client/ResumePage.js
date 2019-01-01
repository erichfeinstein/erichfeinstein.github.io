import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;
import 'react-pdf/dist/Page/AnnotationLayer.css';

import Footer from './Footer';

export default class ResumePage extends React.Component {
  state = { width: 0 };

  componentDidMount() {
    this.changeWidth();
    window.addEventListener('resize', this.changeWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.changeWidth);
  }

  changeWidth = () => {
    this.setState({ width: window.innerWidth });
  };

  render() {
    return (
      <div>
        <div id="resume" align="center">
          <Document file="documents/EricFeinsteinResume2018.pdf">
            <Page pageNumber={1} width={this.state.width * 0.85} />
          </Document>
        </div>
        <Footer />
      </div>
    );
  }
}
