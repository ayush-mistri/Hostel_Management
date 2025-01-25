import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

function Contact() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [buttonColor, setButtonColor] = useState('bg-blue-500 hover:bg-blue-700');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);

    emailjs.send('service_zd8j699', 'template_h47lvfd', {
      email,
      subject,
      message,
    }, 'qKgzsdh_j7Y3WDoxz')
      .then(() => {
        setIsSending(false);
        setIsSent(true);
        setButtonColor('bg-green-500 hover:bg-green-700'); // Change button color to green

        // Reload page after 3 seconds
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        setIsSending(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'subject') {
      setSubject(value);
    } else if (name === 'message') {
      setMessage(value);
    }
  };

  return (
    <section className="bg-white dark:bg-primary">
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">Contact Us</h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-white sm:text-xl">If you are facing any problem or if you have any queries, let us know.</p>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              className="shadow-sm bg-highlight border border-secondary text-secondary text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-highlight dark:border-secondary dark:placeholder-black dark:text-white dark:focus:ring-primary dark:focus:border-primary dark:shadow-sm-light"
              placeholder="name@flowbite.com"
              required
            />
          </div>
          <div>
            <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={subject}
              onChange={handleInputChange}
              className="block p-3 w-full text-sm text-gray-900 bg-primary rounded-lg border border-gray-300 shadow-sm focus:ring-primary focus:border-primary dark:bg-highlight dark:border-secondary dark:placeholder-black dark:text-white dark:focus:ring-primary dark:focus:border-primary dark:shadow-sm-light"
              placeholder="Let us know how we can help you"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your message</label>
            <textarea
              id="message"
              name="message"
              rows="6"
              value={message}
              onChange={handleInputChange}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary focus:border-primary dark:bg-highlight dark:border-secondary dark:placeholder-black dark:text-white dark:focus:ring-primary dark:focus:border-primary"
              placeholder="Leave a comment..."
            ></textarea>
          </div>
          <button
            type="submit"
            className={`py-3 px-5 text-sm font-medium text-center text-white rounded-lg ${buttonColor} sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-800`}
            disabled={isSending || isSent}
          >
            {isSending ? 'Sending...' : isSent ? 'Sent!' : 'Send message'}
          </button>
        </form>
      </div>
    </section>
  );
}

export { Contact };
