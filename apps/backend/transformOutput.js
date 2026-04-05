import fs from 'fs';

try {
  // Read the original file
  const fileContent = fs.readFileSync('./output--26aug.json', 'utf8');
  const originalData = JSON.parse(fileContent);

  console.log(`Processing ${originalData.length} constituencies...`);

  // Transform function
  function transformConstituency(constituency) {
    // Transform vidhayak survey scores
    if (constituency.vidhayak_info && constituency.vidhayak_info.survey_score) {
      constituency.vidhayak_info.survey_score = constituency.vidhayak_info.survey_score.map(question => ({
        ...question,
        yes_votes: [], // Convert from number to empty array
        no_votes: [],  // Convert from number to empty array
        score: 0       // Reset score to 0
      }));
    }

    // Transform department survey scores
    if (constituency.dept_info) {
      constituency.dept_info = constituency.dept_info.map(dept => {
        // Add id field if missing
        if (!dept.id) {
          dept.id = generateUUID();
        }

        if (dept.survey_score) {
          dept.survey_score = dept.survey_score.map(question => ({
            ...question,
            ratings: {
              "1": [], // Convert from number to empty array
              "2": [], // Convert from number to empty array
              "3": [], // Convert from number to empty array
              "4": [], // Convert from number to empty array
              "5": []  // Convert from number to empty array
            },
            score: 0 // Reset score to 0
          }));
        }
        
        return {
          ...dept,
          average_score: 0 // Reset department average score to 0
        };
      });
    }

    // Add id field to other_candidates if missing
    if (constituency.other_candidates) {
      constituency.other_candidates = constituency.other_candidates.map(candidate => ({
        ...candidate,
        id: candidate.id || generateUUID()
      }));
    }

    // Reset manifesto score to 0
    if (constituency.vidhayak_info) {
      constituency.vidhayak_info.manifesto_score = 0;
    }

    return constituency;
  }

  // Simple UUID generator function
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Transform all constituencies
  const transformedData = originalData.map((constituency, index) => {
    console.log(`Transforming constituency ${index + 1}: ${constituency.area_name}`);
    return transformConstituency(constituency);
  });

  // Write the transformed data to finalObj.json
  fs.writeFileSync('./finalObj.json', JSON.stringify(transformedData, null, 2), 'utf8');

  console.log('✅ Transformation completed successfully!');
  console.log(`📄 Output saved to: finalObj.json`);
  console.log(`📊 Processed ${transformedData.length} constituencies`);

  // Log summary of changes
  console.log('\n📋 Summary of changes:');
  console.log('• yes_votes: number → empty array []');
  console.log('• no_votes: number → empty array []');
  console.log('• ratings["1"-"5"]: number → empty array []');
  console.log('• All scores reset to 0');
  console.log('• Added UUIDs to dept_info and other_candidates where missing');

} catch (error) {
  console.error('❌ Error during transformation:', error.message);
  
  if (error.code === 'ENOENT') {
    console.error('Make sure output--26aug.json exists in the current directory');
  } else if (error instanceof SyntaxError) {
    console.error('Invalid JSON format in output--26aug.json');
  }
}
