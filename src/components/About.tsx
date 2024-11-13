export const HowToUse = () => {
  return (
    <>
      <div className="how-to-use flex py-5 sm:py-0" id="how-to-use">
        <div className="section1 sm:w-1/2 sm:grid place-content-center px-5">
          <img
            src="/get-post-id.jpg" // Replace with the appropriate image file path for instructions
            className="w-[35rem] h-[35rem] object-contain rounded-3xl"
            alt="Getting Post ID"
          />
        </div>
        <div className="section2 sm:w-1/2 flex flex-col gap-3 justify-center px-6 sm:pr-10">
          <h1 className="text-3xl font-bold">How to Use the Sentiment Analysis App</h1>
          <p className="text-xl font-semibold">Step-by-step Guide</p>
          <p className="text-lg">
            Follow these simple steps to start using the sentiment analysis app and analyze Facebook comments:
          </p>
          {/* Step 1 */}
          <div className="step">
            <h2 className="text-lg font-semibold">Step 1: Get the Post ID</h2>
            <p className="text-lg">
              First, you need to get the Post ID of the Facebook post you want to analyze.
              Follow these steps to get the Post ID:
            </p>
            <ul className="text-lg">
            <img
            src="/get-date.jpg" // Replace with the appropriate image file path for instructions
            className="w-[35rem] h-[35rem] object-contain rounded-3xl"
            alt="Getting Post ID"
            />
              <li>Go to the Facebook post that you want to analyze and click on the date.</li>
              <li>Press "Right-Click to View Page Source(or in Chroms, its Ctrl+U)</li>
              <li>Press "Ctrl+F" to search for "post_id"</li>
              <li>The Post ID is a long string of numbers (ex. "post_id=123456789..."). Copy this number.</li>
            </ul>
            <img
              src="/get-date.jpg" // Replace with the image showing where the Post ID is in the Facebook URL
              className="w-[35rem] h-[20rem] object-contain rounded-3xl mt-4"
              alt="Post ID Example"
            />
          </div>
          {/* Step 2 */}
          <div className="step mt-6">
            <h2 className="text-lg font-semibold">Step 2: Paste the Post ID</h2>
            <p className="text-lg">
              After copying the Post ID, go back to the Sentiment Analysis app and paste it into the provided input field.
            </p>
            <img
              src="/paste-post-id.jpg" // Replace with an image showing the input field
              className="w-[35rem] h-[20rem] object-contain rounded-3xl mt-4"
              alt="Pasting Post ID"
            />
          </div>
          {/* Step 3 */}
          <div className="step mt-6">
            <h2 className="text-lg font-semibold">Step 3: Analyze the Sentiment</h2>
            <p className="text-lg">
              Once you paste the Post ID and click "Submit," the app will process the comments from the post and provide a sentiment analysis. The results will show you:
            </p>
            <ul className="text-lg">
              <li>The overall sentiment score for and analysis the post</li>
              <li>Top positive and negative words</li>
              <li>Core sentences from the comments</li>
            </ul>
            <img
              src="/analyze-sentiment.jpg" // Replace with an image showing the result after analysis
              className="w-[35rem] h-[20rem] object-contain rounded-3xl mt-4"
              alt="Sentiment Analysis Result"
            />
          </div>
          <p className="text-lg mt-6">
            Enjoy using the Sentiment Analysis App! Now you can easily evaluate feedback and get insights from any Facebook post.
          </p>
        </div>
      </div>
    </>
  );
};
