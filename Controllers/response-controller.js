const ResponseModel = require('../storeResponseDB');

const getResponse = async (req, res) => {
  const responseList = await ResponseModel.find();
  res.status(200).json({ message: "All responses", payload: responseList });
};

const addResponse = async (req, res) => {
  const responseDetails = req.body;
  const responseDocument = new ResponseModel(responseDetails);
  const newResponse = await responseDocument.save();
  res.status(201).json({ message: "Response added successfully!", payload: newResponse });
};

const deleteResponse = async (req, res) => {
  const { _id } = req.params; // Mongo _id from client
  const deleted = await ResponseModel.findByIdAndDelete(_id);
  if (!deleted) return res.status(404).send({ message: "Response not found" });
  res.send({ message: "Response deleted", payload: deleted._id });
};

module.exports = { getResponse, addResponse, deleteResponse };