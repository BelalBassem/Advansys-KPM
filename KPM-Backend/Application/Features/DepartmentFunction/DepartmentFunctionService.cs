namespace Application.Features.DepartmentFunction;
using Domain.Entities;
using Application.DepartmentFunctions.DTOs;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

public class DepartmentFunctionService
{
    private readonly IApplicationDBContext _context;
    private readonly ILogger<DepartmentFunctionService> _logger;
    public DepartmentFunctionService(
        IApplicationDBContext context,
        ILogger<DepartmentFunctionService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<DepartmentFunctionDTO?> getDepartmentFunction(int departmentId, int functionId)
    {
        var returned = await _context.DepartmentFunction
        .Where(departmentFunction =>
            departmentFunction.DepartmentID == departmentId &&
            departmentFunction.FunctionID == functionId)
        .FirstOrDefaultAsync();

        return new DepartmentFunctionDTO
        {
            DepartmentID = returned.DepartmentID,
            FunctionID = returned.FunctionID
        };
    }

    public async Task<DepartmentFunctionDTO?> createDepartmentFunction(int departmentId, int functionId)
    {
        var departmentFunction = new DepartmentFunction
        {
            DepartmentID = departmentId,
            FunctionID = functionId
        };

        await _context.DepartmentFunction.AddAsync(departmentFunction);
        return new DepartmentFunctionDTO
        {
            DepartmentID = departmentFunction.DepartmentID,
            FunctionID = departmentFunction.FunctionID
        };
    }

    public async Task<DepartmentFunctionDTO?> updateDepartmentFunction(
        int departmentId,
        int functionId,
        int newDepartmentId,
        int newFunctionId)
    {
        var departmentFunction = await _context.DepartmentFunction.FirstOrDefaultAsync(departmentFunction =>
            departmentFunction.DepartmentID == departmentId &&
            departmentFunction.FunctionID == functionId);

        _context.DepartmentFunction.Remove(departmentFunction);

        var updatedDepartmentFunction = new DepartmentFunction
        {
            DepartmentID = newDepartmentId,
            FunctionID = newFunctionId
        };

        await _context.DepartmentFunction.AddAsync(updatedDepartmentFunction);
        await _context.SaveChangesAsync();

        return new DepartmentFunctionDTO
        {
            DepartmentID = updatedDepartmentFunction.DepartmentID,
            FunctionID = updatedDepartmentFunction.FunctionID
        };
    }

    public async Task<DepartmentFunctionDTO?> deleteDepartmentFunction(int departmentId, int functionId)
    {
        var departmentFunction = await _context.DepartmentFunction.FirstOrDefaultAsync(departmentFunction =>
            departmentFunction.DepartmentID == departmentId &&
            departmentFunction.FunctionID == functionId);

        _context.DepartmentFunction.Remove(departmentFunction);
        await _context.SaveChangesAsync();

        return new DepartmentFunctionDTO
        {
            DepartmentID = departmentFunction.DepartmentID,
            FunctionID = departmentFunction.FunctionID
        };
    }
}
