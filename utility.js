function utc2Jst(utcDate) {
    var japanTime = new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // 24時間制
    }).format(utcDate);
  
    return japanTime;
  }

  // クエリ文字列をオブジェクトに変換
function parseQueryString(queryString) {
    const params = {};
    const queryStringWithoutQuestionMark = queryString.slice(1); // 先頭の ? を削除
  
    queryStringWithoutQuestionMark.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      params[key] = decodeURIComponent(value?.replace(/\+/g, ' '));
    });
  
    return params;
  }