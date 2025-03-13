import React from 'react';
import { BsArrowLeft, BsArrowRight, BsDot } from 'react-icons/bs';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5; // Number of visible page numbers
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <li key={i}>
                    <button
                        onClick={() => handlePageChange(i)}
                        className={`pagination-link ${currentPage === i ? 'active' : ''}`}
                    >
                        {i}
                    </button>
                </li>
            );
        }

        if (startPage > 1) {
            pages.unshift(
                <li key="start-ellipsis">
                    <button className="pagination-link" disabled>
                        <BsDot size={16} />
                    </button>
                </li>
            );
        }

        if (endPage < totalPages) {
            pages.push(
                <li key="end-ellipsis">
                    <button className="pagination-link" disabled>
                        <BsDot size={16} />
                    </button>
                </li>
            );
        }

        return pages;
    };

    return (
        <ul className="list-unstyled d-flex align-items-center gap-2 mb-0 pagination-common-style">
            <li>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-link"
                >
                    <BsArrowLeft size={16} />
                </button>
            </li>
            {renderPageNumbers()}
            <li>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-link"
                >
                    <BsArrowRight size={16} />
                </button>
            </li>
        </ul>
    );
};

export default Pagination;