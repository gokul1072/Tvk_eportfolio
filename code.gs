/**
 * TVK Party ePortfolio - Production Server Engine
 * Core Server Routing, Data Tokenizer, & Secured Spreadsheet Operations
 */

function doGet() {
  return HtmlService.createTemplateFromFile('src/Index')
      .evaluate()
      .setTitle('TVK Party ePortfolio')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

/**
 * Cleanly injects layout partials into the core Index master template template
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Aggregates configuration layers and returns sanitized organizational data sets
 */
function getPartyData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const memberSheet = ss.getSheetByName("Members");
  const configSheet = ss.getSheetByName("Config");
  
  if (!memberSheet) {
    throw new Error("Sheet tab named 'Members' not found.");
  }

  // 1. Extract application layout branding configurations
  let appLogoUrl = "https://via.placeholder.com/100"; 
  if (configSheet) {
    const configData = configSheet.getDataRange().getValues();
    for (let i = 0; i < configData.length; i++) {
      if (configData[i][0] && configData[i][0].toString().trim() === "AppLogo") {
        let rawLogoUrl = configData[i][1] ? configData[i][1].toString().trim() : "";
        appLogoUrl = processDriveUrl(rawLogoUrl) || appLogoUrl;
        break;
      }
    }
  }
  
  // 2. Aggregate general cadres and operational teams
  const data = memberSheet.getDataRange().getValues();
  data.shift(); // Remove descriptive headers from indexing array
  
  const teamsMap = {};
  
  data.forEach((row, index) => {
    if (!row[0]) return; 

    let rawTeamName = row[6] ? row[6].toString().trim() : "";
    const positionText = row[1] ? row[1].toString().trim() : 'உறுப்பினர்';
    const posLower = positionText.toLowerCase();

    let finalTeamName = rawTeamName;
    const teamLower = rawTeamName.toLowerCase();
    
    if (teamLower === "" || teamLower === "general cadre" || teamLower === "member" || rawTeamName === "உறுப்பினர்" || teamLower === "common") {
      finalTeamName = "General Cadre / உறுப்பினர்";
    }

    const member = {
      id: "m_" + index, 
      name: row[0].toString().trim(),
      position: (posLower === 'member' || posLower === '' || positionText === 'உறுப்பினர்') ? 'உறுப்பினர்' : positionText,
      imageUrl: processDriveUrl(row[2]) || "https://via.placeholder.com/150", 
      area: row[4] || "பொதுப் பிரிவு",
      contact: row[5] ? row[5].toString().trim() : "விபரம் இல்லை"
    };
    
    if (!teamsMap[finalTeamName]) {
      teamsMap[finalTeamName] = {
        teamName: finalTeamName,
        isProtected: false,
        positionHolders: [],
        normalMembers: []
      };
    }

    if (member.position === 'உறுப்பினர்') {
      teamsMap[finalTeamName].normalMembers.push(member);
    } else {
      teamsMap[finalTeamName].positionHolders.push(member);
    }
  });
  
  // 3. Inject explicitly locked infrastructure parameters for the Women's Wing
  teamsMap["மகளிர் அணி (Women's Wing)"] = {
    teamName: "மகளிர் அணி (Women's Wing)",
    isProtected: true, 
    positionHolders: [],
    normalMembers: []
  };
  
  return {
    appLogo: appLogoUrl,
    teams: Object.values(teamsMap) 
  };
}

/**
 * Validates unique gateway access keys to cleanly unpack the Women's Wing data matrix
 */
function verifyAndFetchWomenData(inputPassword) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName("Config");
  const womenSheet = ss.getSheetByName("WomenWing");
  
  if (!womenSheet) {
    return { success: false, message: "WomenWing என்ற தனி ஷீட் காணப்படவில்லை!" };
  }
  
  let correctPassword = "TVK"; 
  if (configSheet) {
    const configData = configSheet.getDataRange().getValues();
    for (let i = 0; i < configData.length; i++) {
      if (configData[i][0] && configData[i][0].toString().trim() === "WomenWingPassword") {
        correctPassword = configData[i][1].toString().trim();
        break;
      }
    }
  }
  
  if (inputPassword !== correctPassword) {
    return { success: false, message: "தவறான கடவுச்சொல்! (Incorrect Password)" };
  }
  
  const data = womenSheet.getDataRange().getValues();
  data.shift(); 
  
  const positionHolders = [];
  const normalMembers = [];
  
  data.forEach((row, index) => {
    if (!row[0]) return;
    
    const positionText = row[1] ? row[1].toString().trim() : 'உறுப்பினர்';
    const posLower = positionText.toLowerCase();
    
    const member = {
      id: "w_" + index,
      name: row[0].toString().trim(),
      position: (posLower === 'member' || posLower === '' || positionText === 'உறுப்பினர்') ? 'உறுப்பினர்' : positionText,
      imageUrl: processDriveUrl(row[2]) || "https://via.placeholder.com/150",
      area: row[4] || "பொதுப் பிரிவு",
      contact: row[5] ? row[5].toString().trim() : "விபரம் இல்லை"
    };
    
    if (member.position === 'உறுப்பினர்') {
      normalMembers.push(member);
    } else {
      positionHolders.push(member);
    }
  });
  
  return {
    success: true,
    teamName: "மகளிர் அணி (Women's Wing)",
    positionHolders: positionHolders,
    normalMembers: normalMembers
  };
}

/**
 * Administrative Challenge Gate - Performs backend server-side validation using Config metrics
 */
function authenticateAdmin(username, password) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName("Config");
  
  let targetUser = "admin";
  let targetPass = "TVK@admin2026"; 
  
  if (configSheet) {
    const configData = configSheet.getDataRange().getValues();
    for (let i = 0; i < configData.length; i++) {
      if (configData[i][0] && configData[i][0].toString().trim() === "AdminUsername") {
        targetUser = configData[i][1].toString().trim();
      }
      if (configData[i][0] && configData[i][0].toString().trim() === "AdminPassword") {
        targetPass = configData[i][1].toString().trim();
      }
    }
  }
  
  if (username === targetUser && password === targetPass) {
    return { success: true, token: Utilities.base64Encode(username + ":" + targetPass) };
  }
  
  return { success: false, message: "பயனர் பெயர் அல்லது கடவுச்சொல் தவறு! (Invalid Credentials)" };
}

/**
 * Normalizes Google Drive storage sharing pathways into CDN thumb endpoints
 */
function processDriveUrl(urlStr) {
  if (!urlStr) return "";
  let processed = urlStr.trim();
  if (processed.includes("drive.google.com")) {
    let fileId = "";
    if (processed.includes("id=")) {
      fileId = processed.split("id=")[1].split("&")[0];
    } else if (processed.includes("/file/d/")) {
      fileId = processed.split("/file/d/")[1].split("/")[0];
    }
    if (fileId) {
      return "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w1000";
    }
  }
  return processed;
}