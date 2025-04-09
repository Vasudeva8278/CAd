import React, { useState, useEffect, ChangeEvent } from 'react';

interface Block {
  id: number;
  name: string;
  x: number;
  y: number;
}

const BlockList: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    fetch(`http://localhost:3001/blocks?name=${search}`)
      .then((res) => res.json())
      .then((data) => setBlocks(data.data));
  }, [search]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div>
      <input
        placeholder="Search by name..."
        onChange={handleSearchChange}
        value={search}
      />
      <ul>
        {blocks.map((block) => (
          <li key={block.id}>
            {block.name} ({block.x}, {block.y})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlockList;
