import axios from 'axios';

const baseURL = 'http://your-iriusrisk-instance/api/v1';
const apiKey = 'your-api-key'; // Replace with your actual API key

axios.defaults.baseURL = baseURL;
axios.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';

async function createComponent() {
    const componentData = {
        ref: "aws-s3",
        name: "AWS S3 Bucket",
        desc: "Component representing an AWS S3 Bucket",
        visible: true,
        category: {
            name: "Storage"
        }
    };

    try {
        const response = await axios.post('/security-content/components', componentData);
        console.log('Component Created:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to create component:', error);
    }
}

async function createLibrary(componentRef: string) {
    const libraryData = {
        ref: "lib-aws-s3",
        name: "AWS S3 Security Library",
        desc: "Library containing risk patterns related to AWS S3",
        riskPatterns: [
            {
                ref: "aws-s3-rp1",
                name: "AWS S3 Risk Pattern",
                desc: "Risk pattern for AWS S3 Bucket",
                components: [componentRef]
            }
        ]
    };

    try {
        const response = await axios.post('/libraries', libraryData);
        console.log('Library Created:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to create library:', error);
    }
}

async function addThreatToRiskPattern(libraryId: string, riskPatternId: string) {
    const threatData = {
        ref: "threat1",
        name: "Threat 1",
        desc: "Description of Threat 1"
    };

    try {
        const response = await axios.post(`/libraries/${libraryId}/riskpatterns/${riskPatternId}/threats`, threatData);
        console.log('Threat Added:', response.data);
    } catch (error) {
        console.error('Failed to add threat:', error);
    }
}

async function main() {
    const component = await createComponent();
    if (!component) return;

    const library = await createLibrary(component.ref);
    if (!library) return;

    const riskPattern = library.riskPatterns.find(rp => rp.ref === 'aws-s3-rp1');
    if (!riskPattern) {
        console.error('Risk pattern not found in the created library');
        return;
    }

    await addThreatToRiskPattern(library.ref, riskPattern.ref);
}

main();
