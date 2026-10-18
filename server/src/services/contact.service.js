
import ContactMessage from "../models/ContactMessage.js";

export async function createContactMessage(messageData) {
  const { name, email, subject, message } = messageData;

  const contactMessage = await ContactMessage.create({
    name,
    email,
    subject,
    message,
    status: "unread",
  });

  return contactMessage;
}

export async function getContactMessages() {
  return ContactMessage.find()
    .sort({ createdAt: -1 });
}

export async function getContactMessageById(id) {
  return ContactMessage.findById(id);
}

export async function updateContactMessage(id, updates) {
  return ContactMessage.findByIdAndUpdate(
    id,
    { $set: updates },
    {
      new: true,
      runValidators: true,
    }
  );
}

export async function deleteContactMessage(id) {
  return ContactMessage.findByIdAndDelete(id);
}
