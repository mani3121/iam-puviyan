import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ContactNowTabletPage: React.FC<Props> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const [isSubmitted, setIsSubmitted] = useState(false);

  const isAllEmpty = !name && !email && !message;


  const resetForm = () => {
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
    setIsSubmitted(false);
  };


  const handleClose = () => {
    resetForm();
    onClose();
  };


  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  if (!isOpen) return null;


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
    <div onClick={handleClose} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" >
       <div onClick={(e) => e.stopPropagation()} className="w-[420px] px-8 py-10 relative bg-[#111] rounded-2xl" >
         <button onClick={handleClose} className="absolute right-6 top-6 text-white"><X size={20} /></button>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-semibold"> Name</label>
            <input
              type="text"
              placeholder="Enter a name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`px-3 py-2 bg-transparent rounded-lg outline outline-1 text-white ${isSubmitted && !name
                  ? "outline-red-500"
                  : errors.name
                    ? "outline-red-500"
                    : "outline-white/20"
                }`}
            />
            {!isAllEmpty && errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>


          <div className="flex flex-col gap-2">
            <label className="text-white text-sm font-semibold">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter a email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={handleEmailBlur}
              className={`px-3 py-2 bg-transparent rounded-lg outline outline-1 text-white ${isSubmitted && !email
                  ? "outline-red-500"
                  : errors.email
                    ? "outline-red-500"
                    : "outline-white/20"
                }`}
            />
            {!isAllEmpty && errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>


          <div className="flex flex-col gap-2">
            <label className="text-white text-sm font-semibold">
              Message
            </label>
            <textarea
              placeholder="Enter a Message"
              value={message}
              onChange={(e) => handleMessageChange(e.target.value)}
              className={`px-3 py-2 h-36 bg-transparent rounded-lg outline outline-1 text-white resize-none ${isSubmitted && !message
                  ? "outline-red-500"
                  : errors.message
                    ? "outline-red-500"
                    : "outline-white/20"
                }`}
            />
            {!isAllEmpty && errors.message && (
              <p className="text-red-500 text-xs">{errors.message}</p>
            )}
          </div>


          <button className="h-10 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactNowTabletPage;