// import React, { useState, useEffect, useContext } from 'react';
// import { Rating, Button, TextField, Avatar } from '@mui/material';
// import { FaUserCircle } from 'react-icons/fa';
// import { ImSpinner3 } from 'react-icons/im';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { AuthContext } from '../context/AuthContext';
// import { getAccess } from '../auth';
// import API_BASE_URL from '../config/config';
// import { useNavigate } from 'react-router-dom';

// const ProductReviews = ({ productId,onReviewAdded }) => {
//     const { user } = useContext(AuthContext);
//     const navigate = useNavigate();

//     const [reviews, setReviews] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [stats, setStats] = useState({ average: 0, total: 0 });

//     // New Review State
//     const [rating, setRating] = useState(0);
//     const [comment, setComment] = useState('');
//     const [submitLoading, setSubmitLoading] = useState(false);

//     // Fetch API
//     const fetchReviews = async () => {
//         try {
//             const response = await axios.get(`${API_BASE_URL}/api/products/${productId}/reviews/`);
//             setReviews(response.data.reviews || []);
//             setStats({
//                 average: response.data.average_rating || 0,
//                 total: response.data.total_reviews || 0
//             });
//             console.log("Fetched Reviews:", response.data);
//         } catch (error) {
//             console.error("Error fetching reviews", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (productId) fetchReviews();
//     }, [productId]);

//     // Submit API
//     const handleSubmitReview = async (e) => {
//         e.preventDefault();

//         if (!user) {
//             toast.info("Please login to write a review");
//             navigate('/login');
//             return;
//         }
//         if (rating === 0) {
//             toast.error("Please select a star rating");
//             return;
//         }

//         setSubmitLoading(true);
//         try {
//             const token = getAccess();
//             const response = await axios.post(`${API_BASE_URL}/api/products/${productId}/reviews/`, {
//                 rating,
//                 comment
//             }, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (response.data.success) {
//                 toast.success("Review submitted successfully!");
//                 setRating(0);
//                 setComment('');
//                 fetchReviews(); // Refresh review list instantly
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.error || "Failed to submit review");
//         } finally {
//             setSubmitLoading(false);
//         }
//     };

//     if (loading) {
//         return <div className="flex justify-center py-10"><ImSpinner3 className="animate-spin text-2xl text-blue-500" /></div>;
//     }

//     return (
//         <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 sm:p-6 md:p-8 mt-8">
//             <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Customer Reviews</h2>

//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

//                 {/* 🌟 Left Side: Stats & Form */}
//                 <div className="lg:col-span-4 flex flex-col gap-6">

//                     {/* Overall Rating Box */}
//                     <div className="bg-gray-50 rounded-lg p-5 text-center flex flex-col items-center justify-center border border-gray-200">
//                         <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900">{Number(stats.average).toFixed(1)}</h3>
//                         <Rating value={Number(stats.average)} precision={0.5} readOnly size="large" className="my-2" />
//                         <p className="text-sm text-gray-500 font-medium">Based on {stats.total} reviews</p>
//                     </div>

//                     {/* Write Review Form */}
//                     <div className="mt-2">
//                         <h3 className="text-base font-bold text-gray-800 mb-3">Write a Review</h3>
//                         <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
//                             <div>
//                                 <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Your Rating *</p>
//                                 <Rating
//                                     name="product-rating"
//                                     value={rating}
//                                     onChange={(event, newValue) => setRating(newValue)}
//                                     size="large"
//                                 />
//                             </div>

//                             <TextField
//                                 placeholder="What did you like or dislike about this product?"
//                                 multiline
//                                 rows={3}
//                                 value={comment}
//                                 onChange={(e) => setComment(e.target.value)}
//                                 variant="outlined"
//                                 fullWidth
//                                 size="small"
//                                 sx={{ '& .MuiInputBase-root': { fontSize: '14px' } }}
//                             />

//                             <Button
//                                 type="submit"
//                                 variant="contained"
//                                 disabled={submitLoading}
//                                 className="py-2.5! shadow-none! capitalize! font-semibold!"
//                             >
//                                 {submitLoading ? <ImSpinner3 className="animate-spin text-lg" /> : "Submit Review"}
//                             </Button>
//                         </form>
//                     </div>
//                 </div>

//                 {/* 🌟 Right Side: Review List */}
//                 <div className="lg:col-span-8">
//                     {reviews.length === 0 ? (
//                         <div className="h-full min-h-50 flex flex-col items-center justify-center text-center py-10 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
//                             <Rating value={0} readOnly size="large" className="opacity-30 mb-3" />
//                             <h3 className="text-lg font-bold text-gray-700">No reviews yet</h3>
//                             <p className="text-sm text-gray-500 mt-1">Be the first to review this product!</p>
//                         </div>
//                     ) : (
//                         <div className="flex flex-col gap-5 md:gap-6">
//                             {reviews.map((review, index) => (
//                                 <div key={index} className="flex gap-3 md:gap-4 pb-5 md:pb-6 border-b border-gray-100 last:border-0 last:pb-0">

//                                     {/* User Avatar */}
//                                     <div className="shrink-0 pt-1">
//                                         {review?.user_profile_pic ? (
//                                             <Avatar src={review.user_profile_pic} alt={review.user_name} sx={{ width: 40, height: 40 }} />
//                                         ) : (
//                                             <Avatar sx={{ width: 40, height: 40, bgcolor: '#e5e7eb', color: '#9ca3af' }}>
//                                                 <FaUserCircle size={24} />
//                                             </Avatar>
//                                         )}
//                                     </div>

//                                     {/* Review Content */}
//                                     <div className="flex-1">
//                                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
//                                             <h4 className="font-bold text-sm md:text-base text-gray-900">
//                                                 {review?.user_name}
//                                             </h4>
//                                             <span className="text-mobile-1 md:text-xs text-gray-400 font-medium">
//                                                 {new Date(review.created_at).toLocaleDateString('en-IN', {
//                                                     year: 'numeric', month: 'short', day: 'numeric'
//                                                 })}
//                                             </span>
//                                         </div>

//                                         <Rating value={review.rating} readOnly size="small" className="mb-2" />

//                                         {review.comment && (
//                                             <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
//                                                 {review.comment}
//                                             </p>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductReviews;


import React, { useState, useEffect, useContext } from 'react';
import { Rating, Button, TextField, Avatar, LinearProgress, FormControl, Select, MenuItem } from '@mui/material';
import { FaUserCircle } from 'react-icons/fa';
import { ImSpinner3 } from 'react-icons/im';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { getAccess } from '../auth';
import API_BASE_URL from '../config/config';
import { useNavigate } from 'react-router-dom';

const ProductReviews = ({ productId, onReviewAdded }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Pagination & Reviews State
    const [reviews, setReviews] = useState([]);
    const [sortBy, setSortBy] = useState('newest');
    // Stats state update karo
    const [stats, setStats] = useState({ average: 0, total: 0, distribution: {} });
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadMoreLoading, setLoadMoreLoading] = useState(false);

    // New Review Form State
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);

    // 🌟 Paginated Fetch Logic
    const fetchReviews = async (pageNumber = 1, currentSort = sortBy) => {
        if (pageNumber === 1) setLoading(true);
        else setLoadMoreLoading(true);

        try {
            const response = await axios.get(`${API_BASE_URL}/api/products/${productId}/reviews/?page=${pageNumber}&sort=${sortBy}`);

            if (pageNumber === 1) {
                setReviews(response.data.reviews || []);
            } else {
                setReviews(prev => [...prev, ...(response.data.reviews || [])]);
            }
            // console.log(`Fetched Reviews for Page ${pageNumber}:`, response.data);
            setStats({ average: response.data.average_rating, total: response.data.total_reviews, distribution: response.data.distribution });

            setHasNext(response.data.has_next);
        } catch (error) {
            console.error("Error fetching reviews", error);
        } finally {
            setLoading(false);
            setLoadMoreLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            setPage(1);
            fetchReviews(1, sortBy);
        }
    }, [productId, sortBy]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchReviews(nextPage);
    };

    // 🌟 Submit Review Logic
    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.info("Please login to write a review");
            navigate('/login');
            return;
        }
        if (rating === 0) {
            toast.error("Please select a star rating");
            return;
        }

        setSubmitLoading(true);
        try {
            const token = getAccess();
            const response = await axios.post(`${API_BASE_URL}/api/products/${productId}/reviews/`, {
                rating,
                comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success("Review submitted successfully!");
                setRating(0);
                setComment('');

                // Refresh list from page 1 to show the new review at the top
                setPage(1);
                fetchReviews(1);

                // Notify parent to update Top Stats
                if (onReviewAdded) onReviewAdded();
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to submit review");
        } finally {
            setSubmitLoading(false);
        }
    };

    // if (loading) {
    //     return <div className="flex justify-center py-10"><ImSpinner3 className="animate-spin text-2xl text-blue-500" /></div>;
    // }

    // if (loading && page === 1) return <div className="flex justify-center py-10"><ImSpinner3 className="animate-spin text-3xl text-blue-600" /></div>;

    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 sm:p-6 md:p-8 mt-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Customer Reviews</h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

                {/* 🌟 Left Side: Stats & Form */}
                <div className="lg:col-span-4 flex flex-col gap-6">

                    {/* Overall Rating Box (Data passed from Parent) */}
                    <div className="bg-gray-50 rounded-lg p-5 text-center flex flex-col items-center justify-center border border-gray-200">
                        <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                            {Number(stats.average || 0).toFixed(1)}
                        </h3>
                        <Rating value={Number(stats.average || 0)} precision={0.5} readOnly size="large" className="my-2" />
                        <p className="text-sm text-gray-500 font-medium">Based on {stats.total || 0} reviews</p>
                    </div>

                    {/* 🌟 Progress Bars */}
                    <div className="space-y-2 mt-4">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = stats.distribution[`star${star}`] || 0;
                            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

                            return (
                                <div key={star} className="flex items-center gap-3 text-sm text-gray-600">
                                    <span className="w-10 text-right">{star} Star</span>
                                    <LinearProgress
                                        variant="determinate"
                                        value={percentage}
                                        className="flex-1 h-2 rounded-full"
                                        sx={{ backgroundColor: '#e5e7eb', '& .MuiLinearProgress-bar': { backgroundColor: '#facc15' } }}
                                    />
                                    <span className="w-8 text-right text-xs text-gray-400">{count}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Write a Review Form */}
                    <div className="mt-2">
                        <h3 className="text-base font-bold text-gray-800 mb-3">Write a Review</h3>
                        <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                            <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Your Rating *</p>
                                <Rating
                                    name="product-rating"
                                    value={rating}
                                    onChange={(event, newValue) => setRating(newValue)}
                                    size="large"
                                />
                            </div>

                            <TextField
                                placeholder="What did you like or dislike about this product?"
                                multiline
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                variant="outlined"
                                fullWidth
                                size="small"
                                sx={{ '& .MuiInputBase-root': { fontSize: '14px' } }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={submitLoading}
                                className="py-2.5! shadow-none! capitalize! font-semibold!"
                            >
                                {submitLoading ? <ImSpinner3 className="animate-spin text-lg" /> : "Submit Review"}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* 🌟 Right Side: Paginated Review List */}
                {/* <div className="lg:col-span-8">
                    {reviews.length === 0 ? (
                        <div className="h-full min-h-50 flex flex-col items-center justify-center text-center py-10 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                            <Rating value={0} readOnly size="large" className="opacity-30 mb-3" />
                            <h3 className="text-lg font-bold text-gray-700">No reviews yet</h3>
                            <p className="text-sm text-gray-500 mt-1">Be the first to review this product!</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5 md:gap-6">

                            <div className="flex justify-between items-center mb-6 pb-2 border-b">
                                <h3 className="font-bold text-gray-800">All Reviews</h3>

                                <FormControl size="small" sx={{ minWidth: 140 }}>
                                    <Select
                                        value={sortBy}
                                        onChange={(e) => {
                                            setSortBy(e.target.value);
                                            setPage(1); // Sort change hone par page 1 par wapas aana zaroori hai
                                        }}
                                        className="bg-white text-sm"
                                    >
                                        <MenuItem value="newest">Most Recent</MenuItem>
                                        <MenuItem value="highest">Highest Rating</MenuItem>
                                        <MenuItem value="lowest">Lowest Rating</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            {reviews.map((review, index) => (
                                <div key={index} className="flex gap-3 md:gap-4 pb-5 md:pb-6 border-b border-gray-100 last:border-0 last:pb-0">

                                    <div className="shrink-0 pt-1">
                                        {review?.user_profile_pic ? (
                                            <Avatar
                                                src={review.user_profile_pic.startsWith('http') ? review.user_profile_pic : `${API_BASE_URL}${review.user_profile_pic}`}
                                                alt={review.user_name}
                                                sx={{ width: 40, height: 40 }}
                                            />
                                        ) : (
                                            <Avatar sx={{ width: 40, height: 40, bgcolor: '#e5e7eb', color: '#9ca3af' }}>
                                                <FaUserCircle size={24} />
                                            </Avatar>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                            <h4 className="font-bold text-sm md:text-base text-gray-900">
                                                {review?.user_name}
                                            </h4>
                                            <span className="text-mobile-1 md:text-xs text-gray-400 font-medium">
                                                {new Date(review.created_at).toLocaleDateString('en-IN', {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <Rating value={review.rating} readOnly size="small" className="mb-2" />

                                        {review.comment && (
                                            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                {review.comment}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {hasNext && (
                                <div className="text-center mt-4">
                                    <Button
                                        variant="outlined"
                                        onClick={handleLoadMore}
                                        disabled={loadMoreLoading}
                                        className="rounded-full! px-6! capitalize! font-semibold!"
                                    >
                                        {loadMoreLoading ? <ImSpinner3 className="animate-spin text-lg" /> : "Load More Reviews"}
                                    </Button>
                                </div>
                            )}

                        </div>
                    )}
                </div> */}

                <div className="lg:col-span-8 flex flex-col">

                    <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800">All Reviews</h3>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-gray-50 text-sm font-medium"
                                disabled={loading && page === 1} // Sort badalte waqt thodi der disable kar do
                            >
                                <MenuItem value="newest">Most Recent</MenuItem>
                                <MenuItem value="highest">Highest Rated</MenuItem>
                                <MenuItem value="lowest">Lowest Rated</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div className="space-y-6">
                        {/* 🌟 NAYA LOGIC: Agar page 1 load ho raha hai, toh sirf is area me spinner dikhao */}
                        {loading && page === 1 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                                <ImSpinner3 className="animate-spin text-4xl text-blue-600 mb-4" />
                                <p className="text-sm">Loading reviews...</p>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                                No reviews yet. Be the first to review!
                            </div>
                        ) : (
                            reviews.map((rev, i) => (
                                <div key={i} className="border-b border-gray-100 pb-6 flex gap-4 last:border-0">
                                    <Avatar
                                        src={rev.user_profile_pic?.startsWith('http') ? rev.user_profile_pic : `${API_BASE_URL}${rev.user_profile_pic}`}
                                        sx={{ width: 44, height: 44 }}
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <h5 className="font-bold text-gray-900">{rev.user_name}</h5>
                                            <span className="text-xs text-gray-400 font-medium">
                                                {new Date(rev.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <Rating value={rev.rating} readOnly size="small" className="mb-2" />
                                        {rev.comment && <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{rev.comment}</p>}
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Load More Button */}
                        {hasNext && (
                            <div className="text-center pt-4">
                                <Button variant="outlined" onClick={() => fetchReviews(page + 1, sortBy)} disabled={loading} className="rounded-full! px-8! font-bold!">
                                    {loading && page > 1 ? <ImSpinner3 className="animate-spin text-xl mr-2" /> : null}
                                    {loading && page > 1 ? "Loading..." : "Load More"}
                                </Button>
                            </div>
                        )}
                    </div>
                    
                </div>

            </div>

        </div>

    );

};

export default ProductReviews;