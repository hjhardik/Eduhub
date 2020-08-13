//ADOBE PDF TOOLS API CODE TO CONVERT TO PDF
const PDFToolsSdk = require("@adobe/documentservices-pdftools-node-sdk");
const fs = require("fs");

module.exports = async function (imageLoc) {
  var output;
  try {
    // Initial setup, create credentials instance.
    const credentials = PDFToolsSdk.Credentials.serviceAccountCredentialsBuilder()
      .fromFile("dc-services-sdk-credentials.json")
      .build();

    // Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext = PDFToolsSdk.ExecutionContext.create(credentials),
      createPdfOperation = PDFToolsSdk.CreatePDF.Operation.createNew();

    // Set operation input from a source file.
    const input = PDFToolsSdk.FileRef.createFromLocalFile(
      `./public/canvas/${imageLoc}.png`
    );
    createPdfOperation.setInput(input);

    // Execute the operation and Save the result to the specified location.
    await createPdfOperation
      .execute(executionContext)
      .then((result) => {
        result.saveAsFile(`./public/canvas/${imageLoc}.pdf`);
        output = `${imageLoc}.pdf`;
      })
      .then(() => {
        fs.unlinkSync(`./public/canvas/${imageLoc}.png`);
      })
      .catch((err) => {
        if (
          err instanceof PDFToolsSdk.Error.ServiceApiError ||
          err instanceof PDFToolsSdk.Error.ServiceUsageError
        ) {
          console.log("Exception encountered while executing operation", err);
        } else {
          console.log("Exception encountered while executing operation", err);
        }
      });
  } catch (err) {
    console.log("Exception encountered while executing operation", err);
  }
  return output; //send back putput PDF file location
};
