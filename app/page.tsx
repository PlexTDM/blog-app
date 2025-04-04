import React from "react";

interface CardProps {
  children?: React.ReactNode;
}

const Card = ({ children }: CardProps) => {
  return (
    <div className="grow rounded-lg min-w-[300px] h-[500px] p-4 shadow-md hover:shadow-lg duration-200 cursor-pointer shadow-accent/50">
      {children}
    </div>
  );
};

const Home = () => {
  return (
    <section className="container mx-auto">
      <div className="flex flex-wrap justify-center gap-4">
        <Card>Card 1</Card>
        <Card>Card 2</Card>
        <Card>Card 3</Card>
      </div>
    </section>
  );
};

export default Home;
