import { supabase } from '../lib/supabase' // 경로는 2단계에서 생성한 파일 위치에 맞게 조정

async function testPolicy() {
  const { data, error } = await supabase.from('members').select('*')
  console.log(data, error) // policy가 맞게 동작하는지 확인
}

export default testPolicy
