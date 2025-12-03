const CLOUDS = ['AWS', 'GCP'];
const SERVICES = ['EC2', 'S3', 'BigQuery', 'CloudSQL', 'Lambda', 'GKE', 'RDS'];
const TEAMS = ['Core', 'Web', 'Data', 'Mobile', 'Platform'];
const ENVS = ['prod', 'staging', 'dev'];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateRandomRow(id) {
  const cloud = rand(CLOUDS);
  const service = rand(SERVICES);
  const team = rand(TEAMS);
  const env = rand(ENVS);
  const date = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)).toISOString().slice(0, 10);
  const cost = parseFloat((Math.random() * 1200).toFixed(2));
  return { id: String(id), date, cloud, service, team, env, cost };
}
