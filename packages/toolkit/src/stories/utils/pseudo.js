const makePseudoStory = (Story, pseudo) => {
  const PseudoStory = Story.bind({});
  PseudoStory.args = Story.args;
  PseudoStory.parameters = { pseudo: { [pseudo]: true } };
  PseudoStory.storyName = `:${pseudo}`;
  return PseudoStory;
};

export default makePseudoStory;
