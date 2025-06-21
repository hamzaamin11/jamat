type PageType = {
  handleIncrementPageButton?: () => void;
  handleDecrementPageButton?: () => void;
  page?: number;
};
export const Pagination = ({
  handleIncrementPageButton,
  handleDecrementPageButton,
  page,
}: PageType) => {
  return (
    <div>
      <div className="join flex items-center justify-end my-2 gap-2  ">
        <button
          className="join-item btn bg-sky-500 border-sky-600  "
          onClick={handleDecrementPageButton}
        >
          «
        </button>
        <button className="join-item btn bg-white text-gray-700 border-gray-600 text-xs lg:text-sm">
          Page {page}
        </button>
        <button
          className="join-item btn bg-sky-500 border-sky-600"
          onClick={handleIncrementPageButton}
        >
          »
        </button>
      </div>
    </div>
  );
};
