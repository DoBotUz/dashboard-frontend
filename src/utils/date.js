export default function transformToLocal(value) {
  return new Date(value).toLocaleDateString();
}
