namespace KPM.Controllers;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using Application.Features.DepartmentFunction;

[ApiVersion(1.0)]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public class DepartmentFunctionController : ControllerBase
{
    private readonly DepartmentFunctionService _departmentFunction;

    public DepartmentFunctionController(DepartmentFunctionService departmentFunctionService)
    {
        _departmentFunction = departmentFunctionService;
    }

    [HttpGet("{departmentId:int}/{functionId:int}")]
    public async Task<IActionResult> GetDepartmentFunctionByID(int departmentId, int functionId)
    {
        var departmentFunction = await _departmentFunction.getDepartmentFunction(departmentId, functionId);

        if (departmentFunction is null)
            return NotFound();

        return Ok(departmentFunction);
    }

    [HttpPost]
    public async Task<IActionResult> CreateDepartmentFunction(int departmentId, int functionId)
    {
        var departmentFunction = await _departmentFunction.createDepartmentFunction(departmentId, functionId);

        return Ok(departmentFunction);
    }

    [HttpPut("{departmentId:int}/{functionId:int}")]
    public async Task<IActionResult> UpdateDepartmentFunction(
        int departmentId,
        int functionId,
        int newDepartmentId,
        int newFunctionId)
    {
        var departmentFunction = await _departmentFunction.updateDepartmentFunction(
            departmentId,
            functionId,
            newDepartmentId,
            newFunctionId);

        if (departmentFunction is null)
            return NotFound();

        return Ok(departmentFunction);
    }

    [HttpDelete("{departmentId:int}/{functionId:int}")]
    public async Task<IActionResult> DeleteDepartmentFunctionByID(int departmentId, int functionId)
    {
        var result = await _departmentFunction.deleteDepartmentFunction(departmentId, functionId);

        if (result is null)
            return NotFound();

        return Ok(result);
    }
}
