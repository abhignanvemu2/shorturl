const geoip = require('geoip-lite');  // Use a geo-location library like geoip-lite

// Function to get location data based on the request
const getLocationDataFromRequest = async (req) => {
    const clientIp = 
    // await getIp() 
    // ?? 
    req.headers["x-forwarded-for"]
        ? req.headers["x-forwarded-for"].split(",")[0].trim() // Get the first IP if forwarded
        : req.ip;
    
    const locationData = geoip.lookup(clientIp);
    return {
        accessedBy: clientIp,
        location: {
            city: locationData?.city || null,
            region: locationData?.region || null,
            country: locationData?.country || null,
            latitude: locationData?.ll?.[0] || null,
            longitude: locationData?.ll?.[1] || null,
        },
    };
};


function getDomainName(url) {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    // const domainParts = hostname.replace('www.', '').split('.');
    // return domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
    return hostname
}

const getIp = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP:', error);
    }
  };
  
module.exports = { getLocationDataFromRequest, getDomainName, getIp };
