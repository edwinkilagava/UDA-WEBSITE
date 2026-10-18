
import mongoose from "mongoose";

import {
  createContactMessage as createMessage,
  getContactMessages as getMessages,
  getContactMessageById as getMessageById,
  updateContactMessage as updateMessage,
  deleteContactMessage as deleteMessage,
} from "../services/contact.service.js";

// Create a contact message (public)
export async function createContactMessage(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (
      !name?.trim() ||
      !email?.trim() ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject, and message are required.",
      });
    }

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const contactMessage = await createMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been submitted successfully.",
      data: {
        id: contactMessage._id,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Get all contact messages (admin)
export async function getContactMessages(req, res, next) {
  try {
    const messages = await getMessages();

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
}

// Get one contact message (admin)
export async function getContactMessageById(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact message ID.",
      });
    }

    const contactMessage = await getMessageById(id);

    if (!contactMessage) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: contactMessage,
    });
  } catch (error) {
    next(error);
  }
}

// Update contact message status (admin)
export async function updateContactMessage(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact message ID.",
      });
    }

    const allowedStatuses = ["unread", "read", "resolved"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status.",
      });
    }

    const contactMessage = await updateMessage(id, { status });

    if (!contactMessage) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message status updated.",
      data: contactMessage,
    });
  } catch (error) {
    next(error);
  }
}

// Delete contact message (admin)
export async function deleteContactMessage(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact message ID.",
      });
    }

    const contactMessage = await deleteMessage(id);

    if (!contactMessage) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}
