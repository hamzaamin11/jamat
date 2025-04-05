import { useState } from "react";

export const Pagination = () => {
  const [page, setPage] = useState(1);

  return (
    <div>
      <div className="join flex items-center justify-end my-2 gap-2 ">
        <button
          className="join-item btn bg-sky-500 border-sky-600"
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
        >
          «
        </button>
        <button className="join-item btn bg-white text-gray-700 border-gray-600">
          Page {page}
        </button>
        <button
          className="join-item btn bg-sky-500 border-sky-600"
          onClick={() => setPage(page + 1)}
        >
          »
        </button>
      </div>
    </div>
  );
};
