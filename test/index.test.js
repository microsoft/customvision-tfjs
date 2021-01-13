describe('ObjectDetection', () => {
  it('can construct model', () => {
    const model = new cvstfjs.ObjectDetectionModel();
  });

  it('can postprocess correctly', (done) => {
    const model = new cvstfjs.ObjectDetectionModel();
    $.getJSON('od_output.json', async (data) => {
      const results = await model._postprocess([data]);
      console.log(results);
      chai.assert(results[2][0] === 2);
      done();
    });
  }).timeout(10000);
});

describe('Classification', () => {
  it('can construct model', () => {
    const model = new cvstfjs.ClassificationModel();
  });
});
