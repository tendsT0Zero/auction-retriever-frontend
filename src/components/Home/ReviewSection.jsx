// ReviewSection component.
import React from "react";

function ReviewSection({ testimonials }) {
  return (
    <div className="bg-zinc-100 px-4 sm:px-6">
      <div className="flex flex-wrap justify-evenly gap-4 rounded-md py-12 shadow-md">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="mt-0 w-full max-w-sm rounded-md bg-white p-4 sm:mt-[-50px]"
          >
            <p className="text-zinc-500">{testimonial.role}</p>
            <p className="flex flex-row ">
              {[...Array(testimonial.rating)].map((_, index) => (
                <span key={index} className="text-amber-400">
                  ⭐
                </span>
              ))}
            </p>
            <p className="text-zinc-400 text-sm">{testimonial.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewSection;
