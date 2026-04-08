exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return {statusCode:405,body:'Method not allowed'};
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return {statusCode:500,body:JSON.stringify({error:'No API key configured'})};
  try {
    const body = JSON.parse(event.body);
    const r = await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
      body:JSON.stringify({model:'claude-opus-4-5',max_tokens:1200,messages:body.messages})
    });
    const data = await r.json();
    if(!r.ok) return {statusCode:r.status,body:JSON.stringify({error:data?.error?.message||'Error'})};
    return {statusCode:200,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'},body:JSON.stringify(data)};
  } catch(e){return {statusCode:500,body:JSON.stringify({error:e.message})};}
};