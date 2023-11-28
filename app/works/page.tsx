import {
    ArrowIcon
  } from 'app/components/icons';

export default function Contact() {


    return (
        <section>
        <h1 className="font-bold text-3xl font-serif">My Works</h1>
        <i>And things I'm currenty working on</i>
    
        <p className="my-5 text-neutral-800 dark:text-neutral-200">
          {`I am Currently working on something cool for this page 😎, `}

          </p>

          <p className="my-5 text-neutral-800 dark:text-neutral-200">
          {`But you always welcome to check out my: `}

          <a
            className="flex items-center hover:text-neutral-700 dark:hover:text-neutral-200 transition-all"
            rel="noopener noreferrer"
            target="_blank"
            href="https://drive.google.com/file/d/1ABhmKn6neWu69_1LF2vKreI2jEClMuDM/view?usp=share_link"
          >
            <ArrowIcon />
            Resume
          </a>
        </p>
      </section>
      
    );
  }
  