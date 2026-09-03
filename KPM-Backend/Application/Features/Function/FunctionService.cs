namespace Application.Features.Function;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using DepartmentEntity = Domain.Entities.Department;
using DepartmentFunctionEntity = Domain.Entities.DepartmentFunction;
using FunctionEntity = Domain.Entities.Function;

public class FunctionService
{
    private readonly IApplicationDBContext _context;
    private readonly ILogger<FunctionService> _logger;
    public FunctionService(IApplicationDBContext context, ILogger<FunctionService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<FunctionEntity>> getFunctions(int? departmentId = null)
    {
        var query = _context.Function.AsNoTracking();

        if (departmentId.HasValue)
        {
            query = query.Where(function => function.DepartmentFunction
                .Any(relation => relation.DepartmentID == departmentId.Value));
        }

        return await query.ToListAsync();
    }

    public async Task<FunctionEntity?> getFunction(int id)
    {
        return await _context.Function
            .AsNoTracking()
            .FirstOrDefaultAsync(function => function.Id == id);
    }

    public async Task<int> createFunction(string name, int departmentId)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Function name is required.");

        var departmentExists = await _context.Department
            .AnyAsync(department => department.Id == departmentId);

        if (!departmentExists)
            throw new ArgumentException("Selected department does not exist.");

        var now = DateTime.Now;
        var function = new FunctionEntity
        {
            Name = name.Trim(),
            CreatedDate = now,
            LastModifiedDate = now
        };

        var departmentFunction = new DepartmentFunctionEntity
        {
            DepartmentID = departmentId,
            Function = function
        };

        await _context.Function.AddAsync(function);
        await _context.DepartmentFunction.AddAsync(departmentFunction);
        await _context.SaveChangesAsync();

        return function.Id;
    }

    public async Task<List<DepartmentEntity>> getFunctionDepartments(int functionId)
    {
        return await _context.DepartmentFunction
            .Where(relation => relation.FunctionID == functionId)
            .Select(relation => relation.Department)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task addFunctionToDepartment(int functionId, int departmentId)
    {
        var functionExists = await _context.Function
            .AnyAsync(function => function.Id == functionId);

        if (!functionExists)
            throw new ArgumentException("Selected function does not exist.");

        var departmentExists = await _context.Department
            .AnyAsync(department => department.Id == departmentId);

        if (!departmentExists)
            throw new ArgumentException("Selected department does not exist.");

        var relationExists = await _context.DepartmentFunction.AnyAsync(relation =>
            relation.FunctionID == functionId &&
            relation.DepartmentID == departmentId);

        if (relationExists)
            throw new ArgumentException("Function is already linked to this department.");

        await _context.DepartmentFunction.AddAsync(new DepartmentFunctionEntity
        {
            FunctionID = functionId,
            DepartmentID = departmentId
        });

        await _context.SaveChangesAsync();
    }

    public async Task<bool> removeFunctionFromDepartment(int functionId, int departmentId)
    {
        var relation = await _context.DepartmentFunction.FirstOrDefaultAsync(relation =>
            relation.FunctionID == functionId &&
            relation.DepartmentID == departmentId);

        if (relation is null)
            return false;

        _context.DepartmentFunction.Remove(relation);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<int?> updateFunction(int id, string name)
    {
        var function = await _context.Function.FirstOrDefaultAsync(function => function.Id == id);

        if (function is null)
            return null;

        function.Name = name.Trim();
        function.LastModifiedDate = DateTime.Now;
        await _context.SaveChangesAsync();
        return function.Id;
    }

    public async Task<int?> deleteFunction(int id)
    {
        var function = await _context.Function.FirstOrDefaultAsync(function => function.Id == id);

        if (function is null)
            return null;

        _context.Function.Remove(function);
        await _context.SaveChangesAsync();
        return function.Id;
    }
}
