import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const TermsAndConditionsScreen = () => {
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Terms and Conditions</h2>
      <Link to="/ideas/create" className="btn btn-warning text-white mb-4">
        <FaArrowLeft /> 
      </Link>
      <p>
        Welcome to our Idea Submission Platform. By submitting an idea, you agree to the following terms and conditions:
      </p>
      <h4>1. Idea Ownership</h4>
      <p>
        By submitting an idea, you acknowledge that the university retains the right to review, evaluate, and potentially implement your submission.
      </p>
      <h4>2. Privacy and Confidentiality</h4>
      <p>
        Your personal information will be kept confidential, except in cases where disclosure is required by law or institutional policies.
      </p>
      <h4>3. Submission Guidelines</h4>
      <p>
        - Ideas must be original and not infringe on any third-party rights.<br />
        - Inappropriate or offensive content is strictly prohibited.<br />
        - The university reserves the right to reject or remove any submission without prior notice.
      </p>
      <h4>4. Liability</h4>
      <p>
        The university is not responsible for any disputes arising from idea ownership or implementation.
      </p>
      <h4>5. Acceptance</h4>
      <p>
        By submitting your idea, you confirm that you have read and agreed to these terms and conditions.
      </p>
   
    </Container>
  );
};

export default TermsAndConditionsScreen;
