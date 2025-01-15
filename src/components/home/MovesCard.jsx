import MoveSingleCard from './MoveSingleCard';

const MovesCard = ({ moves, onSave }) => {
  return (
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {moves.map((item) => (
        <MoveSingleCard key={item._id} move={item} onSave={onSave}/>
      ))}
    </div>
  );
};

export default MovesCard;