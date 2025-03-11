import bcrypt from 'bcryptjs';
import postgres from 'postgres';

const user = {
    id: '92b011d8-2b81-458c-af07-afe4df8912f2',
    name: 'abc',
    email: 'abc@def',
    password: '123456',
}

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function addUser() {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await sql`INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;`
}

export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      addUser(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
