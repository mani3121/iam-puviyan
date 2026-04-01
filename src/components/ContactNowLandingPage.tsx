import React, { useState, useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ContactNowLandingPage: React.FC<Props> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const [isSubmitted, setIsSubmitted] = useState(false);

  
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setEmail("");
      setMessage("");
      setErrors({});
      setIsSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isAllEmpty = !name && !email && !message;

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = "Name is required";

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    validate();
  };

  const handleClose = () => {
    // reset immediately on close click
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
    setIsSubmitted(false);
    onClose();
  };

  const handleNameChange = (value: string) => {
    setName(value);

    setErrors((prev) => ({
      ...prev,
      name: value.trim() ? undefined : "Name is required",
    }));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (!value) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }

    setErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handleEmailBlur = () => {
    if (!email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
    } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email",
      }));
    }
  };

  const handleMessageChange = (value: string) => {
    setMessage(value);

    setErrors((prev) => ({
      ...prev,
      message: value.trim() ? undefined : "Message is required",
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-[580px] px-10 py-14 bg-[#111] rounded-2xl relative flex flex-col">
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-white text-lg"
        >
          ✕
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm">Name</label>
            <input
              type="text"
              value={name}
              placeholder="Enter name"
              onChange={(e) => handleNameChange(e.target.value)}
              className={`h-9 px-3 bg-[#111] rounded-lg border text-white ${
                isSubmitted && !name
                  ? "border-red-500"
                  : errors.name
                  ? "border-red-500"
                  : "border-white/20"
              }`}
            />
            {!isAllEmpty && errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>

      
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm">Email</label>
            <input
              type="email"
              value={email}
              placeholder="Enter valid email"
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={handleEmailBlur}
              className={`h-9 px-3 bg-[#111] rounded-lg border text-white ${
                isSubmitted && !email
                  ? "border-red-500"
                  : errors.email
                  ? "border-red-500"
                  : "border-white/20"
              }`}
            />
            {!isAllEmpty && errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>

          
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm">Message</label>

            <textarea
              value={message}
              onChange={(e) => handleMessageChange(e.target.value)}
              placeholder="Enter a Message"
              className={`h-32 px-3 py-2 bg-[#111] rounded-lg border text-white resize-none ${
                isSubmitted && !message
                  ? "border-red-500"
                  : errors.message
                  ? "border-red-500"
                  : "border-white/20"
              }`}
            />
          </div>

          <button className="h-9 bg-green-600 text-white rounded-lg">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactNowLandingPage;