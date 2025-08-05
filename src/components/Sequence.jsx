/* eslint-disable react/prop-types */
const Sequence = ({ sequence }) => {
  return (
    <div>
      <h3>Sequence:</h3>
      <ul className="sequence-list">
        {sequence.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sequence;
