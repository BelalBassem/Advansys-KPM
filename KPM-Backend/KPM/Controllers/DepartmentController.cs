namespace KPM.Controllers;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using Application.Features.Department;

[ApiVersion(1.0)]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public class DepartmentController : ControllerBase
{
    private readonly DepartmentService _department;

    public DepartmentController(DepartmentService ds)
    {
        _department = ds;
    }

    [HttpGet]
    public async Task<IActionResult> GetDepartment()
    {
        var department = await _department.getDepartments();

        if (department is null)
            return NotFound();

        return Ok(department);
    }

    [HttpPost]
    public async Task<IActionResult> CreateDepartment(string name)
    {
        var departmentId = await _department.createDepartment(name);

        return Ok(departmentId);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateDepartment(int id , string name)
    {
        var departmentId = await _department.updateDepartment(id, name);

        if (departmentId is null)
            return NotFound();

        return Ok(departmentId);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteDepartmentByID(int id)
    {
        var result = await _department.deleteDepartment(id);

        if (result is null)
            return NotFound();

        return Ok(result);
    }
}
