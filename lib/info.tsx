import me from "../app/me.jpg";

export const name = "Samuel Ladapo";
export const avatar = me;
export const about = () => {
  return (
    <>
      Hey there 👋🏾 I'm a Full Stack Developer with a passion for building robust
      web & mobile applications.
    </>
  );
};

export const bio = () => {
  return (
    <>
      <p>
        While PHP is my primary language, I enjoy working across the entire tech
        stack to create seamless user experiences.
      </p>

      <p className="mt-4">
        Beyond coding, I'm an avid gamer and anime enthusiast who believes in
        maintaining a healthy work-life balance. My love for travel fuels my
        creativity and brings fresh perspectives to my development approach.
      </p>
      <p className="mt-4">
        Always eager to learn and explore new technologies, I'm constantly
        pushing the boundaries of what's possible in web development.
      </p>
    </>
  );
};
