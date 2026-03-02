
import { EmployeeService } from "@/drizzle/emp-service";
import { revalidatePath } from "next/cache";

/** * SERVER ACTIONS 
 * These call the EmployeeService methods directly
 */
async function handleCreate(formData) {
  "use server";
  const data = Object.fromEntries(formData);

  await EmployeeService.create({
    ...data,
    empId: parseInt(data.empId),
  });

  revalidatePath("/employees");
}

async function handleDelete(id) {
  "use server";
  await EmployeeService.delete(id);
  revalidatePath("/employees");
}

async function handleUpdateName(formData) {
  "use server";
  const id = parseInt(formData.get("empId"));
  const name = formData.get("name");

  await EmployeeService.update(id, { name });
  revalidatePath("/employees");
}

/** * UI COMPONENT 
 */
export default async function EmployeeData() {
  // Read operation using the service
  const employees = await EmployeeService.getAll();

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white min-h-screen">
      <header className="mb-10 flex justify-between items-center border-b pb-6">
        <h1 className="text-2xl font-bold text-gray-800">Team Directory</h1>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          {employees.length} Employees
        </span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: CREATE FORM */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 p-6 bg-gray-50 rounded-2xl border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Add Employee</h2>
            <form action={handleCreate} className="space-y-4">
              <input name="empId" type="number" placeholder="Employee ID" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              <input name="name" placeholder="Full Name" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              <input name="email" type="email" placeholder="Email Address" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              <input name="username" placeholder="Username" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              <input name="password" type="password" placeholder="Password" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              <button className="w-full bg-slate-900 text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition shadow-sm">
                Save Record
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: LIST VIEW */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.map((e) => (
                  <tr key={e.empId} className="group hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{e.name}</div>
                      <div className="text-xs text-gray-400">ID: {e.empId} • @{e.username}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{e.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end items-center gap-3">
                        {/* UPDATE FORM */}
                        <form action={handleUpdateName} className="flex opacity-0 group-hover:opacity-100 transition">
                          <input type="hidden" name="empId" value={e.empId} />
                          <input name="name" defaultValue={e.name} className="border text-xs p-1.5 w-24 rounded-l-md outline-none focus:border-blue-400" />
                          <button className="bg-blue-50 text-blue-600 px-2 rounded-r-md text-xs font-bold border-y border-r">Update</button>
                        </form>

                        {/* DELETE FORM */}
                        <form action={handleDelete.bind(null, e.empId)}>
                          <button className="text-red-500 hover:text-red-700 p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {employees.length === 0 && (
              <div className="p-20 text-center text-gray-400 italic">No employees found in the database.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}